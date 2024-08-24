
const gettoken=()=>{

const token=localStorage.getItem('token')
// console.log(token)

if(token){
    return {headers:{authorization:`Bearer ${token}`}}
}
else{
    
    return {}
}
}

export default gettoken