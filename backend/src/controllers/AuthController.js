import AuthService from '../services/AuthService.js'

const login = async(req, res) => {
    
    const { email, password} = req.body

    try{
        const token = await AuthService.login(email, password);
        res.json({token}).status(201);
    } catch (error) {
        const status = error.message.includes('senha') || error.message.includes('Usuário')? 401 : 500;
        res.status(status).json({message: error.message});
    }
};

export default { login };