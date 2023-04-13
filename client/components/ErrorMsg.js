const ErrorMsg = ({message}) => {
    return <div className="alert alert-danger">
        <h4>Oops...</h4>
        {message}
    </div>
}

export default ErrorMsg;