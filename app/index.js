var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },
  initializing: function(){
    this.pkg = require('../package.json');
  },
  prompting: function(){
    var done = this.async();
    var prompts = [
      {
        type: 'input',
        name: 'appName',
        default: this.appname,
        message: 'Please enter the project\'s name:'
      },
      {
        type: 'input',
        name: 'appDescription',
        default: 'New Project for ' + this.appname,
        message: 'Please enter the project\'s description:'
      },
      {
        type: 'input',
        name: 'appVersion',
        default: '0.0.0',
        message: 'Please enter the project\'s version:'
      },
      {
        type: 'list',
        name: 'cssStyle',
        default: 'less',
        choices: [
          'less',
          'sass'
        ],
        message: 'Choose your CSS preprocessor:',
      }
    ];

    this.prompt(prompts, function(answers){
      this.appName = answers.appName;
      this.appDescription = answers.appDescription;
      this.appVersion = answers.appVersion;
      this.cssStyleChoosen = answers.cssStyle;
      done();
    }.bind(this));
  },
  writing: {
    sourceDir: function(){
      this.directory('source', '');
    },
    packageJSON: function(){
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'),
        {
          name: this.appName,
          description: this.appDescription,
          version: this.appVersion,
          styles: this.cssStyleChoosen,
        }
      )
    },
    editorConfig: function(){
      this.fs.copyTpl(
        this.templatePath('.editorconfig'),
        this.destinationPath('.editorconfig')
      )
    },
    bower: function(){
      this.fs.copyTpl(
        this.templatePath('bower.json'),
        this.destinationPath('bower.json'),
        {
          name: this.appName,
          description: this.appDescription,
          version: this.appVersion,
        }
      );
    },
    eslint: function(){
      this.fs.copyTpl(
        this.templatePath('.eslintrc'),
        this.destinationPath('.eslintrc')
      );
    },
    git: function(){
      this.fs.copyTpl(
        this.templatePath('.gitignore'),
        this.destinationPath('.gitignore')
      );
    },
    config: function(){
      this.fs.copyTpl(
        this.templatePath('config.json'),
        this.destinationPath('config.json')
      );
    },
    readme: function(){
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        {
          name: this.appName
        }
      );
    },
    gulp: function(){
      this.fs.copyTpl(
        this.templatePath('gulpfile.babel.js'),
        this.destinationPath('gulpfile.babel.js'),
        {
          styles: this.cssStyleChoosen
        }
      );
    },
    styles: function(){
      switch(this.cssStyleChoosen){
        case 'sass':
          this.directory('sass', 'source/styles')
          break;
        case 'less':
        default:
            this.directory('less', 'source/styles')
          break;
      }
    }
  },
  install: function(){
    this.installDependencies();
  },
  end: function(){
    this.log('End just ran')
  }
});
