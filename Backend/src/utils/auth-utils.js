import jwt from 'jsonwebtoken'

            function desencriptarToken(vtoken){
            const secretKey = "UmDoisTreisTriesDoisUmoTodoMundoSobreDoisRaizEmCadaUno";
            let token = vtoken;
            let payloadOriginal = null;
            
            try{
                payloadOriginal = jwt.verify(token, secretKey);
                return payloadOriginal;
            } catch (e){
                console.error(e);
            }
        }

export function authMiddleware(request, response, next){
    if(!request.headers.authorization){

        response.status(403).json({message: "Token no existe"})
    }else{
        const desencriptado = desencriptarToken(request.headers.authorization.split(' ')[1])

        if(!desencriptado){
            response.status(401).json({message: "No autenticado"})
        }else{
            request.user = desencriptado;
            next();

        }
    }
}