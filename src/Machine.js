
import Gameloop from 'gameloop';
import World from './World';

export default function(options){

  var game = new Gameloop();
  var world = new World(options.container, options.data);

  game.on('update', dt => {
    world.update(dt);
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

  game.toggleWorld = function(){
    return world.toggle();
  };

  return game;
}
