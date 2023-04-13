import axios from 'axios';
import { useState } from 'react';
import ErrorMsg from '../components/ErrorMsg';


/** method must be = to 'post', 'patch', etc.*/
const useRequest = ({url, method, body, onSuccess}) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err) {
            setErrors(
                <div>
                    {
                        err.response.data.errors.map(err => (
                            <ErrorMsg message={err.message}></ErrorMsg>
                        ))
                    }
                </div>
            )
        }
    };

    return {doRequest, errors};
}

export default useRequest;