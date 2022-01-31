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

    plop.setGenerator('component', {
        description: 'Create a new component or module',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Enter component name: ',
            },
        ],
        actions: [
            {
                type: 'addMany',
                destination: '../src/{{name}}',
                templateFiles: 'component/*.hbs',
            },
        ],
    });

    plop.setGenerator('hook', {
        description: 'Create a new hook',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Enter hook name: ',
            },
        ],
        actions: [
            {
                type: 'addMany',
                destination: '../src/{{name}}',
                templateFiles: 'hook/*.hbs',
            },
        ],
    });
};
