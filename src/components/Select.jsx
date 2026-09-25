import { useTheme } from "../providers/ThemeProvider";


export default function Select({ options, value = "", placeholder, setValue, style, emptyOption = true }) {
    const { theme } = useTheme();
    return (
        <>
            <style>{`
                select.kentu-custom-select {
                    appearance: base-select;
                    border: 1px solid ${theme.border};
                    padding: 10px;
                    transition: 0.4s;
                    text-wrap: nowrap;
                    cursor: pointer
                }
                
                select.kentu-custom-select:hover,
                select.kentu-custom-select:focus {
                    background: ${theme.background};
                }
                
                select.kentu-custom-select::picker-icon {
                    color: ${theme.back4};
                    transition: 0.4s rotate;
                }
                
                select.kentu-custom-select:open::picker-icon {
                    rotate: 180deg;
                }
                
                ::picker(select.kentu-custom-select) {
                    appearance: base-select;
                    border: none;
                    border-radius: 5px;
                    opacity: 0;
                    transition: all 0.4s allow-discrete;
                    top: calc(anchor(bottom) + 1px);
                    left: anchor(10%);
                }
                
                :open::picker(select.kentu-custom-select) {
                    opacity: 1;
                }
                
                @starting-style {
                    :open::picker(select.kentu-custom-select) {
                        opacity: 0;
                    }
                }
                
                select.kentu-custom-select option {
                    display: flex;
                    justify-content: flex-start;
                    gap: 20px;
                    background: ${theme.back2};
                    padding: 10px;
                    transition: 0.4s;
                }
                
                select.kentu-custom-select option:checked {
                    background: ${theme.light1};
                }
                
                
            `}</style>
            <select style={{...style, backgroundColor: theme.card}} className="kentu-custom-select" onChange={(e) => setValue(e.target.value)} value={value}>
                {emptyOption ? <option value="" hidden>{placeholder}</option> : null}
                {options.map((option, index) => {
                    return <option key={index} value={option}>{option}</option>
                })}
            </select>
        </>
    );
}