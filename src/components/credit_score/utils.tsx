import React from "react";
import {NumericFormat} from "react-number-format";

export const EuroNumberFormat = React.forwardRef(function EuroNumberFormat(
    props: any,
    ref
) {
    const {onChange, ...other} = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            decimalScale={2}
            fixedDecimalScale={false}
            onValueChange={(values: any) => {
                onChange({
                    target: {
                        value: values.value,
                        name: props.name,
                    },
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="€ "
        />
    );
});
