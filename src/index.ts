import { parseQueryParams } from "./ParseArgs";
import { InitializeGlobalVariables } from "./global/GlobalVariables"
import { UniformRNG } from "./global/UniformRNG";
import { PerlinNoise } from "./noise/PerlinNoise";
import { PolyTools } from "./geometry/PolyTools";
import { Tree } from "./models/Tree";
import { Arch } from "./models/Arch";
import { Mount } from "./models/Mount";
import { Man } from "./models/Man";
import { MountPlanner } from "./MountPlanner";
import { Memory } from "./struct/Memory";
import { Update } from "./Update";
import { UI } from "./global/UI";
import { Canvas } from "./Canvas";

const rng = new UniformRNG();

const seed = parseQueryParams();
rng.seed(seed);

const perlin = new PerlinNoise(rng);
const polyTools = new PolyTools();

const memory = new Memory();
const tree = new Tree(perlin, polyTools);
const man = new Man(perlin, polyTools);
const arch = new Arch(perlin, polyTools, man);
const mount = new Mount(perlin, tree, arch, polyTools);
const mountPlanner = new MountPlanner(perlin, memory);
const update = new Update(memory, mountPlanner, mount, perlin, arch);
const ui = new UI(memory, update, seed, perlin, man, tree);
const canvas = new Canvas(perlin);

// We add global variables at the end to ensure that we don't inadvertidly depend on them in our Typescript.
InitializeGlobalVariables(rng, ui);