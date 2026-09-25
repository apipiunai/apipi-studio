import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '../providers/ThemeProvider';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function Password({ value, setValue, style, placeholder}) {

    const { theme } = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <FormControl style={{ border: "none" }} variant="outlined">
            <style>{`.MuiInputAdornment-filled {color: ${theme.text2}}`}</style>
            <div style={{ borderRadius: "5px" }}>
                <OutlinedInput
                    id="password"
                    name="password" 
                    sx={{ border: `1px solid ${theme.border}`, height: 37.5, fontSize: "12px", color: theme.text1, backgroundColor: theme.card, ...style }}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={handleChange}
                    size="small"
                    placeholder={placeholder}
                    endAdornment={
                        <InputAdornment position="end" sx={{ scale: 0.8, color: theme.border }}>
                            <RemoveRedEyeIcon onClick={handleClickShowPassword} sx={{ cursor: "pointer" }} />
                        </InputAdornment>
                    }
                />
            </div>
        </FormControl>
    );
}