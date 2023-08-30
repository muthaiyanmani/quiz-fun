
const getData = (key) => { 
    try {
        const data = localStorage.getItem(key);
        return JSON.parse(data);
    }catch (error) {
        console.log(error);
    }
    return null;
}

const setData = (key, value) => { 
    try {
       localStorage.setItem( key, JSON.stringify(value));
    }catch (error) {
        console.log(error);
    }
}

const removeData = (key) => { 
    try {
       localStorage.removeItem(key);
    }catch (error) {
        console.log(error);
    }
}

export { getData, setData, removeData };