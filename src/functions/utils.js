export const objToArr = ({...obj})=>{
    delete obj.customer;
    let arr = Object.keys(obj)
    let x =[];
    for(let i=0; i<arr.length; i++){
        if(arr[i] !== 'id')
        x.push(obj[arr[i]])
    }
    return x
}