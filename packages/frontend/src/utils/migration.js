export const generateMigrationPin = () =>{
    return Math.floor(100000 + Math.random() * 900000);
};
