import * as dotenv from 'dotenv';
dotenv.config();

const currentConfig =  {
    CLIENT_ID: process.env.CLIENT_ID as string,
    TENANT_ID: process.env.TENANT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    AD_FRONTEND_REDIRECT_URI: process.env.AD_FRONTEND_REDIRECT_URI,
    AD_BACKEND_REDIRECT_URI: process.env.AD_BACKEND_REDIRECT_URI as string,
    GROUP_ID: process.env.GROUP_ID,
    FRONTEND_REDIRECT:process.env.AD_FRONTEND_REDIRECT_URI,
  };

export default currentConfig;