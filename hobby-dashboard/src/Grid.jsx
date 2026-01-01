// This is representing a grid layout that uses Components from the Compenet files. 
// It will be a 3x4 gird layout, where you can extend and shorten gird items as needed, as well as add more gird items.
// Each grid item will represent a different hobby or interest, one can be a writing tracker, another can be a something else ect.
import './Gird.css';
import { useRef, useState } from 'react';

function Grid() {
    const [girdItems, setGridItems] = useState([]); 

    const counter = useRef(1);


    function handleAdd(){
        const newItem = {id: counter.current, type: 'hobby'};
        counter.current += 1;
        setGridItems([newItem, ...girdItems]);
    }

    function handleDelete(id){
        setGridItems(girdItems.filter(item => item.id !== id));
    }

    return (  
        <div className="grid-container">

            {girdItems.map((item,index) => (
                <div key={item.id} className="grid-item">
                    {`Hobby ${index+1}`}
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
            ))}

            {girdItems.length < 12 && (
                <div className="grid-item grid-item--button" onClick={handleAdd}>
                    Add a Hobby
                </div>

            )}
        </div>
            
    );
}

export default Grid;