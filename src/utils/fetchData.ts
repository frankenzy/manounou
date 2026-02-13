

const fetchData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Data fetched successfully');
        }, 2000);
    });
}


export default fetchData;