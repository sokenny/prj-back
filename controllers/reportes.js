import mongoose from 'mongoose';
import Orden from '../models/orden.js';
import Operacion from '../models/operacion.js';
import Cliente from '../models/cliente.js';
import MovimientoCaja from '../models/movimiento_caja.js';
import { getCajasDataStructure } from '../GlobalFunctions.js';

export const getAll = async (req, res)=>{

    const query = req.query
    
    if(query.tipo === 'count'){
        
        const periodo = JSON.parse(query.count_periodo)
        
        try{

            var ordenes = await Orden.count({fecha_creado:{
                                            $gte: periodo.from,
                                            $lt: periodo.to
                                        }})
            var operaciones = await Operacion.count({fecha_creado:{
                                            $gte: periodo.from,
                                            $lt: periodo.to
                                        }})
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

    const query = req.query
    const periodo = JSON.parse(query.periodo)
    
    try{
        
        var egresos = await MovimientoCaja.aggregate([{ $match: {
                                                                tipo: 0,
                                                                caja: {$in: ['EUR', 'ARS', 'USD']},
                                                                fecha_creado:{
                                                                    $gte: new Date(periodo.from),
                                                                    $lt: new Date (periodo.to)
                                                                }
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
                                                                fecha_creado:{
                                                                    $gte: new Date(periodo.from),
                                                                    $lt: new Date (periodo.to)
                                                                }
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
            cajas[ingreso._id[1]][ingreso._id[0]].ingresos = ingreso.total
        }

        for(let e in egresos){
            let egreso = egresos[e]
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
        return cajas
        
    }catch(error){
        console.log(error)
        res.status(400).json({message: "An error occured"})

    }


}