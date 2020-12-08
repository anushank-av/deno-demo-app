import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Dog } from "./model/dog.ts";

const env = Deno.env.toObject();
const HOST = env.HOST || '127.0.0.1';
const PORT = env.PORT || 4000;

const router = new Router();
const application = new Application();

let dogs: Array<Dog> = [
    {
        name: 'Roger',
        age: 8,
      },
      {
        name: 'Syd',
        age: 7,
      },
];

export const getDogs = ({response}: {response:any}) => {
    response.body = dogs;
}

export const getDog = ({
    params,
    response,
  }: {
    params: {
      name: string
    }
    response: any
  }) => {
    const dog = dogs.filter((dog) => dog.name === params.name)
    if (dog.length) {
      response.status = 200;
      response.body = dog[0];
      return;
    }
  
    response.status = 400;
    response.body = { msg: `Cannot find dog ${params.name}` };
}

export const addDog = async ({
    request,
    response,
}: {
    request: any,
    response: any,
}) => {
    let body = await request.body();
    let newDog: Dog = body.value;;
    dogs.push(newDog);

    response.body = {message: 'OK'};
    response.status = 200;
}

export const updateDog = async ({
    params,
    request,
    response,
  }: {
    params: {
      name: string
    }
    request: any
    response: any
  }) => {
    const temp = dogs.filter((existingDog) => existingDog.name === params.name)
    const body = await request.body()
    const { age }: { age: number } = body.value
  
    if (temp.length) {
      temp[0].age = age
      response.status = 200
      response.body = { msg: 'OK' }
      return
    }
  
    response.status = 400
    response.body = { msg: `Cannot find dog ${params.name}` }
}

export const removeDog = ({
    params,
    response,
  }: {
    params: {
      name: string
    }
    response: any
  }) => {
    const lengthBefore = dogs.length
    dogs = dogs.filter((dog) => dog.name !== params.name)
  
    if (dogs.length === lengthBefore) {
      response.status = 400
      response.body = { msg: `Cannot find dog ${params.name}` }
      return
    }
  
    response.body = { msg: 'OK' }
    response.status = 200
}

router
  .get('/dogs', getDog)
  .get('/dog/:name', getDog)
  .post('/addDog', addDog)
  .put('/updateDogs/:name', updateDog)
  .delete('/deleteDogs/:name', removeDog);

application.use(router.routes());
application.use(router.allowedMethods());

console.log(`Listening on Port : ${PORT}`);

await application.listen(`${HOST}:${PORT}`);

