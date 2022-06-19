import bcrypt from "bcrypt"


export const hash = (value) =>  {
    return bcrypt.hashSync(value, 12);
}
export const compare = (value, hashedValue) => {
    return bcrypt.compareSync(value, hashedValue);
}

