import React,{useEffect} from 'react'
import { useHistory } from 'react-router';
function ErrorRedirect() {
    const history = useHistory();
    useEffect(()=>{
        history.goBack();
    },[])
    return (
        <>
            
        </>
    )
}

export default ErrorRedirect
