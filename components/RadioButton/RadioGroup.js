const FormLabel = require("../FormLabel/FormLabel");

const getRadioGroup = (attributes) => {
    return ` <Grid item lg={4} className="wrapper">
                ${FormLabel.getFormLebel(attributes)}
                <RadioGroup aria-label="${attributes.id}" name="${attributes.label
        }" >
                    {componentOptions.${attributes.id}Options.map((item) => (
                        <FormControlLabel value={item} control={<Radio />} label={item} /> ))}
                </RadioGroup>
            </Grid>
    `;
};

module.exports = { getRadioGroup };
