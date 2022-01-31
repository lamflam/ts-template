module.exports = (plop) => {
    plop.setGenerator('module', {
        description: 'Create a new module',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Enter component/module name: ',
            },
        ],
        actions: [
            {
                type: 'addMany',
                destination: '../src/{{name}}',
                templateFiles: 'module/*.hbs',
            },
        ],
    });
};
