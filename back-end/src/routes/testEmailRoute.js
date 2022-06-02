import { sendEmail } from "../utils/sendEmail";

export const testEmailRoute = {
    path: '/api/test-email',
    method: 'post',
    handler: async (req, res) => {
        try {
            await sendEmail({
                to: 'fady.ayad7+test1@gmail.com',
                from: 'fady.ayad7@gmail.com',
                subject: 'Does this work ?',
                text: 'Yes it works 😅',
            });
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
};