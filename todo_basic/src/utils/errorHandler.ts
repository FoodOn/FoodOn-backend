import StatusError from '../class/statusError';

const errorHandler = (message: string, status: number): StatusError => {
    const err = new StatusError(message);
    err.status = status;
    return err;
};

export default errorHandler;
