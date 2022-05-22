const excludeRoutes = ['POST|/auth/login', 'POST|/users/', 'POST|/relatory/']
let app

module.exports = class ValidateToken {
    constructor(App) {
        app = App
    }

    execute(req, res, next) {
        if (!excludeRoutes.includes(`${req.method}|${req.path}`)) {
            if (!req.headers.authorization) {
                return res.status(401).json({ error: 'Token não encontrado', });
            }
            else {
                try {
                    const user = app.services.auth.verifyToken(req.headers.authorization)

                    if (!user) {
                        return res.status(401).json({ error: 'Token inválido', });
                    }
                    else {
                        req.user = user
                        next()
                    }
                }
                catch (err) {
                    app.log.error(err)
                    return res.status(500).json({ error: 'Erro ao tentar validar token' })
                }
            }
        }
        else {
            return next()
        }
    }
}