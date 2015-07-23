
import Gameloop from 'gameloop';
import World from './World';
import Input from './Input';

export default function(options){

  var game = new Gameloop();
  var world = new World(options.container, options.data);
  var input = new Input(options.container);
  input.enabled = false;

  game.on('update', dt => {
    world.update(dt);
    input.update(dt);
  });

  game.on('draw', () => {
    world.draw();
  });

  game.on('start', () => {
    world.create();
  });

  game.on('end', () => {
    console.log('machine end!');
  });

  game.on('pause', () => {

  });

  game.on('resume', () => {

  });

  window.world = world;
  window.input = input;

  game.changeMetric = function(type, value){
    return world.changeMetric(type, value);
  };

  game.clearRel = function(){
    input.clear();
    world.clearRelations();
  };

  game.toggleNonRelated = function(){
    world.toggleNonRelated();
  };

  game.showRelationsFor = function(domain){
    world.showRelationsFor(domain);
  };

  return game;
}
