// This is representing a grid layout that uses Components from the Compenet files. 
// It will be a 3x4 gird layout, where you can extend and shorten gird items as needed, as well as add more gird items.
// Each grid item will represent a different hobby or interest, one can be a writing tracker, another can be a something else ect.
import './Gird.css'; // Holds all the styles for the Grid component
import { useRef, useState } from 'react'; // useState for UI state that causes re-renders, useRef for mutable values that don't cause re-renders.

function Grid() {
    const [gridItems, setGridItems] = useState([]); // Array of hobby items with an id and type, order of array represents display order
    const counter = useRef(1); // Unique ID counter for new items, used ref to persist across renders without causing re-renders

    const dragIndexRef = useRef(null); // Index of the item currently being dragged, Mousemoves fires frequently, so useRef to avoid re-renders.

    const [placeholderIndex, setPlaceholderIndex] = useState(null); // This represents where the drag item would land and tells the UI to show a placeholder, triggers a re-render because the UI needs to update.
    const [draggingPos, setDraggingPos] = useState({ x: 0, y: 0 }); // This tracks the current mouse position during dragging to position the dragged item. UseState to trigger re-renders for smooth dragging.
    const [isDragging, setIsDragging] = useState(false); // A booling that is true when dragging is active or false otherwise.

    function onMouseDown(index, e) { // start dragging
        dragIndexRef.current = index; // Store the index of the item being dragged
        setIsDragging(true); // enable dragging state
        setDraggingPos({ x: e.clientX, y: e.clientY }); // Initialize dragging position
        
        // Add event listeners for mousemove and mouseup, because these events need to be tracked globally so that you can drag outside the item bounds.
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) { // handle dragging
        if (dragIndexRef.current === null) return; // No item is being dragged, so prevent any action.

        setDraggingPos({ x: e.clientX, y: e.clientY }); // Update the dragging position to the current mouse position so the dragged item follows the cursor.

        const el = document.elementFromPoint(e.clientX, e.clientY); // This gives you the DOM element currently under the mouse cursor.
        if (!el) return; // No element found, exit.

        const targetIndex = Number(el.dataset.index); // Get the index of the grid item under the cursor from its data attribute. To convert mouse position to grid index.
        if (
            targetIndex === undefined ||
            targetIndex === dragIndexRef.current ||
            targetIndex === placeholderIndex
        ) return; // Ignore Invalid moves, prevents swapting with itself or redundant updates.

        // Update placeholder
        setPlaceholderIndex(targetIndex); // Items rearrangemeent is visually represented by moving a placeholder to the target index.
    }

    function onMouseUp() {
        if (dragIndexRef.current !== null && placeholderIndex !== null) {
            setGridItems(prev => {
                const items = [...prev];
                const dragged = items.splice(dragIndexRef.current, 1)[0];
                items.splice(placeholderIndex, 0, dragged);
                return items;
            });
        } // Reset dragging state, insert it at the placeholder index, update the real gird order

        // Fully exist drag mode
        dragIndexRef.current = null;
        setPlaceholderIndex(null);
        setIsDragging(false);

        // Remove global event listeners, to prevent mouse is dtuck down bugs, memory leaks and host dragging
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    // Creates a new item and adds it to the start of the grid, updates state to trigger re-render.
    function handleAdd() {
        const newItem = { id: counter.current, type: 'hobby' };
        counter.current += 1;
        setGridItems([newItem, ...gridItems]);
    }

    // Filters out the item with the given id from the gridItems array and updates state.
    function handleDelete(id) {
        setGridItems(gridItems.filter(item => item.id !== id));
    }

    // Compute display order with placeholder
    const displayItems = [...gridItems]; // derived array to represent current display order including placeholder
    if (isDragging && dragIndexRef.current !== null && placeholderIndex !== null) {
        const dragged = displayItems.splice(dragIndexRef.current, 1)[0];
        displayItems.splice(placeholderIndex, 0, dragged);
    } // If dragging, adjust displayItems to include the placeholder position.


    // Grid layout calculations
    const columns = Math.ceil(Math.sqrt(gridItems.length + 1));
    const itemRefs = useRef({});

    const draggedEl = itemRefs.current[gridItems[dragIndexRef.current]?.id];
    const width = draggedEl?.offsetWidth || 100;
    const height = draggedEl?.offsetHeight || 100;

    return (
        <div className="grid-container" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {displayItems.map((item, index) => {
                const isPlaceholder = isDragging && placeholderIndex === index;

                return (
                    <div
                        key={isPlaceholder ? 'placeholder' : item.id} // unique key for placeholder
                        ref={el => (itemRefs.current[item.id] = el)}
                        className={`grid-item ${
                            dragIndexRef.current === gridItems.indexOf(item) ? 'dragging' : ''
                        } ${isPlaceholder ? 'placeholder' : ''}`}
                        data-index={index}
                        onMouseDown={e => !isPlaceholder && onMouseDown(gridItems.indexOf(item), e)}
                    >
                        {isPlaceholder ? 'Placeholder' : `Hobby ${gridItems.indexOf(item) + 1}`}
                        {!isPlaceholder && (
                            <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }}>Delete</button>
                        )}
                    </div>
                );
            })}


            {gridItems.length < 12 && (
                <div className="grid-item grid-item--button" onClick={handleAdd}>
                    Add a Hobby
                </div>
            )}

            {isDragging && dragIndexRef.current !== null && (
                <div
                    className="grid-item dragging"
                    style={{
                        position: 'fixed',
                        top: draggingPos.y - height / 2,
                        left: draggingPos.x - width / 2,
                        pointerEvents: 'none',
                        width,
                        height,
                        zIndex: 1000,
                    }}
                >
                    {`Hobby ${dragIndexRef.current + 1}`}
                </div>
            )}
        </div>
    );
}

export default Grid;
