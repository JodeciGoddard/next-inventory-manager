
const Button = ({ bgColor, color, size, text, borderRadius, onClick }) => {

    const clicked = () => {
        if (onClick()) {
            console.log('button clicked')
        }

        return;
    }

    return (
        <button
            type="button"
            style={{
                backgroundColor: bgColor,
                color,
                borderRadius
            }}
            className={`text-${size} p-3 hover:drop-shadow-xl`}
            onClick={clicked}
        >
            {text}
        </button>
    );
}

export default Button;