import React, {useEffect, useState} from 'react';
import axios, {AxiosRequestConfig, Method} from 'axios';

export default function useFetchData(initialConfig: AxiosRequestConfig) {
    const [data, setData] = useState<object | null>(null);
    const [config, setConfig] = useState(initialConfig);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!config.url?.length) {
                return;
            }

            setIsError(false);
            setIsLoading(true);

            try {
                const result = await axios(config);
                setData(result.data);
            } catch (error) {
                setIsError(false);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [config.url, config.method, config.data]);

    return [{data, isLoading, isError}, setConfig] as const;
}
