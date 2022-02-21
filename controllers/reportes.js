import Orden from '../models/orden.js';
import Operacion from '../models/operacion.js';
import Cliente from '../models/cliente.js';
import MovimientoCaja from '../models/movimiento_caja.js';
import { getCajasDataStructure } from '../GlobalFunctions.js';
import { getRegistroBalances, getMovimientosSumados, iterateAndCalculateBalances, fieldsAreInvalid } from './balances.js';

export const getAll = async (req, res)=>{

    const query = req.query
    
    if(query.tipo === 'count'){
        
        const periodo = JSON.parse(query.count_periodo)
        var oficina = req.query.oficina
        if(oficina === ""){
            oficina = {
                $exists: true
            }
        }
        
        try{

            var ordenes = await Orden.count({fecha_creado:{
                                            $gte: periodo.from,
                                            $lt: periodo.to
                                        },
                                        oficina
                                        })
            var operaciones = await Operacion.count({fecha_creado:{
                                            $gte: periodo.from,
                                            $lt: periodo.to
                                        },
                                        oficina
                                        })
            var clientes = await Cliente.count({fecha_creado:{
                                            $gte: periodo.from,
                                            $lt: periodo.to
                                        }})
            
            res.status(200).json({operaciones, ordenes, clientes})
            
        }catch(error){

            res.status(400).json({message: "An error occured"})

        }

    }

}

export const getBalancesCajas = async (req, res, return_res=true)=>{
    try{
        var response = await getRegistroBalances(req, res, true)
        if(response.error === 0){
            var balancesToReturn = response.data.balances;
            const registroBalances = response.data
            const FECHA_ULTIMO_REGISTRO_YMD = registroBalances.registrado_hasta
            const MANANA_YMD = getMananaYmd()
            const movimientos_sumados = await getMovimientosSumados({from:FECHA_ULTIMO_REGISTRO_YMD, to:MANANA_YMD})
            
            balancesToReturn = iterateAndCalculateBalances(balancesToReturn, movimientos_sumados)
        }
        if(return_res){
            return balancesToReturn
        }else{
            res.status(200).json(response)
        }
    }catch(e){
        res.status(400).json({error:1, message: "An error occured getting balances cajas"})
    }
}

function getMananaYmd(){
    let new_date = new Date();
    new_date.setDate(new_date.getDate()+1)
    const MANANA_YMD = new_date.toISOString().split('T')[0]
    return MANANA_YMD
}

// Funcion deprecada pero para controlar que la nueva funcione bien

export const oldGetBalancesCajas = async (req, res, return_res=true)=>{

    const query = req.query
    
    try{
        
        var egresos = await MovimientoCaja.aggregate([{ $match: {
                                                                tipo: 0,
                                                                caja: {$in: ['EUR', 'ARS', 'USD']},
                                                            }
                                                        },
                                                        {
                                                            $group : {
                                                                _id : ["$caja", "$oficina"],
                                                                total : {
                                                                    $sum : "$importe"
                                                                }
                                                            }
                                                        },
                                                        {$sort: {_id:1}},
                                                        
                                                    ])
        var ingresos = await MovimientoCaja.aggregate([{ $match: {
                                                                tipo: 1,
                                                                caja: {$in: ['EUR', 'ARS', 'USD']},
                                                            }
                                                        },
                                                        {
                                                            $group : {
                                                                _id : ["$caja", "$oficina"],
                                                                total : {
                                                                    $sum : "$importe"
                                                                }
                                                            }
                                                        },
                                                        {$sort: {_id:1}},
                                                        
                                                    ]) 

        var cajas = getCajasDataStructure()

        for(let i in ingresos){
            let ingreso = ingresos[i]
            let oficina = ingreso._id[1]
            let divisa = ingreso._id[0]
            if(fieldsAreInvalid(oficina, divisa, 1)){
                continue
            }

            cajas[ingreso._id[1]][ingreso._id[0]].ingresos = ingreso.total
        }

        for(let e in egresos){
            let egreso = egresos[e]
            let oficina = egreso._id[1]
            let divisa = egreso._id[0]
            if(fieldsAreInvalid(oficina, divisa, 1)){
                continue
            }

            cajas[egreso._id[1]][egreso._id[0]].egresos = egreso.total
        }

        for(let o in cajas){
            let oficina = cajas[o]
            for(let c in oficina){
                let caja = oficina[c]
                cajas[o][c].balance = caja.ingresos - caja.egresos
            }
        }

        if(return_res){
            res.status(200).json(cajas)
        }
        // return cajas
        
    }catch(error){
        console.log(error)
        res.status(400).json({message: "An error occured"})

    }


}