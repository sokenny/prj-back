import Movimiento from '../models/movimiento.js';
import MovimientoCaja from '../models/movimiento_caja.js';
import Orden from '../models/orden.js';
import Operacion from '../models/operacion.js';

import { getBalancesCajas } from './reportes.js';

export const getBalancesProveedores = async (periodo)=>{
   
    try{
        var balances_proveedores = await Movimiento.aggregate([
                                                {$match: {
                                                    proveedor: {$ne: null},
                                                    fecha_creado:{
                                                        $gte: new Date(periodo.from),
                                                        $lt: new Date (periodo.to)
                                                    }
                                                }},
                                               { $group : {
                                                    _id : "$proveedor",
                                                    total : {
                                                        $sum : "$importe" 
                                                    }
                                                }},
                                                { $lookup: {from: 'proveedores', localField: '_id', foreignField: '_id', as: 'proveedor'} },
                                                {$sort: {_id:1}}
                                                ])
        return balances_proveedores
        // res.status(200).json(cajas)
    }catch(error){
        console.log(error)
        // res.status(400).json({message: "An error occured"})
    }
}

export const getFaltaPagarFacturas = async (periodo) =>{

    try{

        var falta_facturas = await Orden.aggregate([
            {$match:{
                tipo: "Factura",
                estado: {$ne: "Entregada"},
                fecha_creado:{
                    $gte: new Date(periodo.from),
                    $lt: new Date (periodo.to)
                }
            }},

            { $group : {
                _id : "$tipo",
                total : {
                    $sum : "$tipo_orden.factura.monto_factura_usd_comision" 
                }
            }},

        ])

        return falta_facturas   

    }catch(error){

    }

}

export const getFaltaPagarCrypto = async (periodo) =>{

    try{

        var falta_crypto = await Orden.aggregate([
            {$match: {
                estado: {$ne: ["Entregada"]},
                tipo: {$ne: "Factura"},
                fecha_creado:{
                    $gte: new Date(periodo.from),
                    $lt: new Date (periodo.to)
                }
            }},
            { $group : {
                _id : "$operacion",
                total : {
                    $sum : "$usd" 
                }
            }},
            { $lookup: {from: 'operaciones', localField: '_id', foreignField: '_id', as: 'operacion'} },
            
        ])

        let importe_falta_crypto = 0

        for(let f in falta_crypto){
            if(falta_crypto[f].operacion[0]?.tipo_operacion === "Crypto"){
                importe_falta_crypto += falta_crypto[f].total
            }
        }

        return importe_falta_crypto

    }catch(error){
        console.log(error)
    }

}

export const getFaltaPagarBajadas = async (periodo) =>{

    try{

        var falta_bajadas = await Orden.aggregate([
            {$match: {
                estado: {$nin: ["Entregada"]},
                tipo: {$ne: "Factura"},
                fecha_creado:{
                    $gte: new Date(periodo.from),
                    $lt: new Date (periodo.to)
                }
            }},
            { $group : {
                _id : "$operacion",
                tipo: {"$first": "$tipo"},
                usd : {
                    $sum : "$usd" 
                },
                usd_cash_cash : {
                    $sum : "$tipo_orden.cash.monto_cliente" 
                }

            }},
            { $lookup: {from: 'operaciones', localField: '_id', foreignField: '_id', as: 'operacion'} },
                        
        ])

        let importe_falta_bajadas = 0

        for(let f in falta_bajadas){
            if(falta_bajadas[f].operacion[0]?.tipo_operacion === "Bajada"){

                if(falta_bajadas[f].tipo === "Cash Cash"){
                    importe_falta_bajadas += falta_bajadas[f].usd_cash_cash
                }else {
                    importe_falta_bajadas += falta_bajadas[f].usd
                }
            }
        }

        return importe_falta_bajadas

    }catch(error){
        console.log(error)
    }

}

export const getExistencia = async (req,res) => {

    const query = req.query
    const periodo = JSON.parse(query.periodo)

    function existencia_item(cat, usd, ars, eur){
        return {categoria: cat, usd, ars, eur}
    }

    var existencia = []

    Promise.all([getBalancesCajas(req,res,true), getBalancesProveedores(periodo), getFaltaPagarFacturas(periodo), getFaltaPagarCrypto(periodo), getFaltaPagarBajadas(periodo)]).then((results)=>{

        let balances_cajas = results[0]
        for(let o in balances_cajas){
            if(o !== "null"){
                let oficina = balances_cajas[o]
                existencia.push(existencia_item('Caja '+o, oficina['USD']?.balance, oficina['ARS']?.balance, oficina['EUR']?.balance))
            }
        }

        let balances_proveedores = results[1]
        for(let p in balances_proveedores){
            
            let proveedor = balances_proveedores[p]
            existencia.push(existencia_item(proveedor?.proveedor[0]?.nombre, proveedor.total, "", ""))
            
        }

        let falta_facturas = results[2]
        existencia.push(existencia_item("Falta Fts.", falta_facturas[0]?.total, "", ""))
        
        let falta_crypto = results[3]
        existencia.push(existencia_item("Falta Crypto", falta_crypto, "", ""))
        
        let falta_bajadas = results[4]
        existencia.push(existencia_item("Falta Bajadas", falta_bajadas, "", ""))

        
        res.status(200).json({existencia})

    })
}

    
// Funciones para tabla cierre
export const getGananciaOperaciones = async (periodo) =>{

    try{

        var ganancia_operaciones = await Operacion.aggregate([
            {$match: {
                estado: "Confirmado",
                fecha_creado:{
                    $gte: new Date(periodo.from),
                    $lt: new Date (periodo.to)
                }
            }},
            { $group : {
                _id : "$tipo_operacion",
                ganancia : {
                    $sum : "$ganancia_prj" 
                },
            }},
            
                        
        ])

        return ganancia_operaciones

    }catch(error){
        console.log(error)
    }


}

export const getCatMovCajas = async (periodo) =>{

    try{

        var ganancia_bajadas = await MovimientoCaja.aggregate([
            {$match: {
                categoria : {$ne: null},
                fecha_creado:{
                    $gte: new Date(periodo.from),
                    $lt: new Date (periodo.to)
                }
            }},
            { $group : {
                _id : ["$categoria", "$tipo"],
                total : {
                    $sum : "$importe" 
                },
            }},
                        
        ])

        return ganancia_bajadas

    }catch(error){
        console.log(error)
    }

}

export const getCierre = async (req,res) =>{

    const query = req.query
    const periodo = JSON.parse(query.periodo)

    function cierre_item(cat, debe, haber, tipo){
        return {categoria: cat, debe, haber, tipo}
    }


    var cierre_prj = []
    Promise.all([getGananciaOperaciones(periodo), getCatMovCajas(periodo)]).then((results)=>{
        let ganancias_bajadas = results[0]
        for(let g in ganancias_bajadas){
            let ganancia = ganancias_bajadas[g]
            cierre_prj.push(cierre_item(`Ganancia ${ganancia._id}`, ganancia.ganancia.toFixed(2), "", ""))
        }       

        let cat_mov_cajas = results[1]
        for(let c in cat_mov_cajas){
            let cat = cat_mov_cajas[c]
            let tipo = cat._id[1]
            tipo === 0 ? tipo = "egreso" : tipo = "ingreso"
            cierre_prj.push(cierre_item(cat._id[0], "", cat.total, "movimiento_caja_"+tipo))
        }
        
        res.status(200).json({cierre_prj})

    })


}
