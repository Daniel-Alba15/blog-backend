const axios = require('axios');

const seed = Math.random();

exports.getAvatar = async () => {
    try {
        const { data } = await axios.get(`https://avatars.dicebear.com/api/gridy/${seed}.svg?width=60&weight=60`);
        return data;
    } catch (error) {
        console.error(error);
    }
}