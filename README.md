# Hackdash Visualization

A fun hackdash visualization for Dashboards over time.  
Created using Tweens and HTML5 Canvas native drawings.  

[Demo here](https://pjnovas.github.io/hackdash-visualization/)  

### Develop

Required [GruntJS](http://gruntjs.com/getting-started)
```bash
npm install -g grunt-cli
```

#### Install dependecies

```bash
npm install
```

#### Configure and run

For this visualization to work it needs a `dashboards.json` data, which can be generated with `gen-dashboards.js` using a hackdash database.  

1. create a `config.json` using `config.json.sample`
2. set your Database connection
3. run the generation: `node gen-dashboards.js`
4. compile the client running `grunt`
5. use a quick static server to open the visualization:
```bash
npm install -g wup
wup
```

And open the index.html in your browser: `http://localhost:8080`  

#### Export visualization

To get an export ready for deploy, simply run:  
```bash
grunt dist
```

Which will set the distribution files in `dist/` folder at root.

