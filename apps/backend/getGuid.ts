/**
 * getGuid
 * Created by dcorns on 12/20/21
 * Copyright © 2021 Dale Corns
 */
import crypto from 'crypto';

const getGuid = (key: string, secret: string): string => {
    return crypto.createHmac('sha256', secret)
        .update(key)
        .digest('hex');
};

export default getGuid;