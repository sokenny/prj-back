import RegistroBalances from "../models/registro_balances.js";
import MovimientoCaja from "../models/movimiento_caja.js";
import { getBalancesDataStructure } from "../GlobalFunctions.js";

export const setRegistroBalances = async (req, res) => {
    const { AYER_YMD } = await getDatesForRegistroBalances()
    try{
        var balances = getBalancesDataStructure()
        var movimientos_sumados = await getMovimientosSumados({from: false, to: AYER_YMD})
        balances = iterateAndCalculateBalances(balances, movimientos_sumados)
        var registroBalance = {registrado_hasta: AYER_YMD, balances}
        registroBalance = await new RegistroBalances(registroBalance).save()
        res.status(200).json({error: 0, message:"Registro de balances creado con exito", data: registroBalance})
    }catch(e){
        res.status(404).json({error: 2, message:`Ocurrió un error intentando crear el registro de balances: ${e.message}`})
    }
}   

export const getRegistroBalances = async (req, res, return_res=true) => {
    
    try{
        const registroBalances = await getUltimoRegistro()
        if(return_res){
            return {error: 0, data: registroBalances}
        }else{
            res.status(200).json({error: 0, data: registroBalances})
        }
    }catch(e){
        if(return_res){
            return {error: 1, message: "Ocurrió un error intentando conseguir el registro de balances."}
        }else{
            res.status(200).json({error: 1, message: "Ocurrió un error intentando conseguir el registro de balances."})
        }
    }

}

export async function getMovimientosSumados(period){

    let matchPeriod = {
        fecha_creado:{
            $gte: new Date(period.from),
            $lt: new Date (period.to)
        }
    }

    if(!period.from){
        matchPeriod = {
            fecha_creado:{
                $lt: new Date (period.to)
            }
        }
    }

    return await MovimientoCaja.aggregate([
        {$match: matchPeriod},
        { $group : {
            _id : ["$oficina", "$caja", "$tipo"],
            total : {
                $sum : "$importe"
            }
        }},
    ])
}

async function getUltimoRegistro(){
   var ultimoRegistro = await RegistroBalances.find().limit(1).sort({registrado_hasta: 'desc'})
    ultimoRegistro = ultimoRegistro[0]
    return ultimoRegistro
}

export function iterateAndCalculateBalances(balances, movimientos_sumados){
    for(let m_s of movimientos_sumados){
        let oficina = m_s["_id"][0]
        let divisa = m_s["_id"][1]
        let tipo = m_s["_id"][2]
        if(fieldsAreInvalid(oficina, divisa, tipo)){
            continue
        }
        if(tipo === 1){
            balances[oficina][divisa].balance += m_s.total
        }else if(tipo === 0){
            balances[oficina][divisa].balance -= m_s.total
        }
    }

    return balances
}

async function getDatesForRegistroBalances(){
    let new_date = new Date();
    new_date.setDate(new_date.getDate()-1)
    const AYER_YMD = new_date.toISOString().split('T')[0]
    new_date.setDate(new_date.getDate()-29)
    const TREINTA_DIAS_ATRAS_YMD = new_date.toISOString().split('T')[0]
    new_date.setDate(new_date.getDate()-30)
    const SESENTA_DIAS_ATRAS_YMD = new_date.toISOString().split('T')[0]
    const HOY_YMD = new Date().toISOString().split('T')[0]
    var ultimoRegistro = await getUltimoRegistro()
    const FECHA_ULTIMO_REGISTRO_YMD = ultimoRegistro.registrado_hasta

    console.log('HOY: ', HOY_YMD, ' - AYER: ', AYER_YMD, ' - TREINTA: ', TREINTA_DIAS_ATRAS_YMD, ' - SESENTA: ', SESENTA_DIAS_ATRAS_YMD)

    return {HOY_YMD, AYER_YMD, TREINTA_DIAS_ATRAS_YMD, SESENTA_DIAS_ATRAS_YMD, FECHA_ULTIMO_REGISTRO_YMD}
}

export function fieldsAreInvalid(oficina, divisa, tipo){
    return oficina === null || oficina === "" || divisa === null || divisa === "" || tipo === null || tipo === ""
}