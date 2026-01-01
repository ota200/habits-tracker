// This is representing a grid layout that uses Components from the Compenet files. 
// It will be a 3x4 gird layout, where you can extend and shorten gird items as needed, as well as add more gird items.
// Each grid item will represent a different hobby or interest, one can be a writing tracker, another can be a something else ect.
import './Gird.css';

function Grid() {
    return (  
        <div className="grid-container">
            <div className="grid-item grid-item--button">First</div>
            <div className="grid-item">Second</div>
            <div className="grid-item">Third</div>
            <div className="grid-item">Fourth</div>
            <div className="grid-item">Fifth</div>
            <div className="grid-item">Sixth</div>
            <div className="grid-item">Seventh</div>
            <div className="grid-item">Eighth</div>
            <div className="grid-item">Ninth</div>
            <div className="grid-item">Tenth</div>
            <div className="grid-item">Eleventh</div>
            <div className="grid-item">Twelfth</div>
        </div>
            
    );
}

export default Grid;