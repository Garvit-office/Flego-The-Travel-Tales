import bcrypt from "bcryptjs";
import type { User, Trip, Blog, TravelStyle } from "@/types/index";

/**
 * In-memory "tables".
 * ---------------------------------------------------------------------------
 * A `globalThis` singleton so the store survives Next.js dev-mode hot
 * reloads (each route module reload would otherwise re-import this file and
 * wipe the arrays). Nothing outside this file should touch `store` directly
 * — everything else goes through userRepo / tripRepo / blogRepo below, so a
 * future swap to Mongoose/Prisma only means rewriting the bodies of those
 * repo methods. Route handlers and components never need to change.
 */
interface Store {
  users: User[];
  trips: Trip[];
  blogs: Blog[];
  counters: { userId: number; tripId: number; blogId: number };
  seeded: boolean;
}

const globalForDb = globalThis as unknown as { __flegoStore?: Store };

const store: Store =
  globalForDb.__flegoStore ??
  (globalForDb.__flegoStore = {
    users: [],
    trips: [],
    blogs: [],
    counters: { userId: 1, tripId: 1, blogId: 1 },
    seeded: false,
  });

/* ============================================================================
 * REPOSITORIES
 * ==========================================================================*/

export const userRepo = {
  // TODO(DB swap): User.find()
  findAll: (): User[] => store.users,

  // TODO(DB swap): User.findById(id)
  findById: (id: number | string): User | undefined =>
    store.users.find((u) => u.id === Number(id)),

  // TODO(DB swap): User.findOne({ email })
  findByEmail: (email: string): User | undefined =>
    store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()),

  // TODO(DB swap): User.create({ ...data })
  create: (data: {
    name: string;
    email: string;
    password: string;
    bio?: string;
  }): User => {
    const user: User = {
      id: store.counters.userId++,
      name: data.name,
      email: data.email,
      password: data.password, // caller must already have hashed this
      bio: data.bio ?? "",
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    return user;
  },

  // Strips the password hash before a user is ever sent in a response.
  toPublic: (user: User) => {
    const { password, ...publicUser } = user;
    return publicUser;
  },
};

export const tripRepo = {
  // TODO(DB swap): Trip.find({ ...filters }).sort({ createdAt: -1 })
  findAll: (search?: string): Trip[] => {
    let results = [...store.trips].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (t) =>
          t.destination.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q)
      );
    }

    return results;
  },

  // TODO(DB swap): Trip.findById(id)
  findById: (id: number | string): Trip | undefined =>
    store.trips.find((t) => t.id === Number(id)),

  // TODO(DB swap): Trip.create({ ...data })
  create: (data: {
    title: string;
    destination: string;
    dates?: string;
    budget?: string;
    style?: TravelStyle;
    spots: number;
    description?: string;
    hostId: number;
    host: string;
  }): Trip => {
    const trip: Trip = {
      id: store.counters.tripId++,
      title: data.title,
      destination: data.destination,
      dates: data.dates || "Dates TBD",
      budget: data.budget || "TBD",
      style: data.style || "Backpacking",
      spots: data.spots,
      spotsLeft: data.spots,
      description: data.description || "",
      hostId: data.hostId,
      host: data.host,
      joinedUsers: [],
      createdAt: new Date().toISOString(),
    };
    store.trips.push(trip);
    return trip;
  },

  // TODO(DB swap): Trip.findByIdAndUpdate(id, { $inc: { spotsLeft: -1 }, $push: { joinedUsers: userId } })
  addParticipant: (id: number | string, userId: number): Trip | null => {
    const trip = store.trips.find((t) => t.id === Number(id));
    if (!trip) return null;
    trip.spotsLeft -= 1;
    trip.joinedUsers.push(userId);
    return trip;
  },
};

export const blogRepo = {
  // TODO(DB swap): Blog.find().sort({ createdAt: -1 })
  findAll: (): Blog[] =>
    [...store.blogs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),

  // TODO(DB swap): Blog.findById(id)
  findById: (id: number | string): Blog | undefined =>
    store.blogs.find((b) => b.id === Number(id)),

  // TODO(DB swap): Blog.create({ ...data })
  create: (data: {
    title: string;
    excerpt: string;
    authorId: number;
    author: string;
    readTime?: string;
    comments?: number;
  }): Blog => {
    const blog: Blog = {
      id: store.counters.blogId++,
      title: data.title,
      excerpt: data.excerpt,
      authorId: data.authorId,
      author: data.author,
      readTime: data.readTime || "5 min read",
      likes: 0,
      likedBy: [],
      comments: data.comments ?? 0,
      createdAt: new Date().toISOString(),
    };
    store.blogs.push(blog);
    return blog;
  },

  // TODO(DB swap): Blog.findByIdAndUpdate(id, { $push / $pull on likedBy, $inc on likes })
  toggleLike: (id: number | string, userId: number): Blog | null => {
    const blog = store.blogs.find((b) => b.id === Number(id));
    if (!blog) return null;

    const idx = blog.likedBy.indexOf(userId);
    if (idx === -1) {
      blog.likedBy.push(userId);
      blog.likes += 1;
    } else {
      blog.likedBy.splice(idx, 1);
      blog.likes -= 1;
    }

    return blog;
  },
};

/* ============================================================================
 * SEED DATA
 * ==========================================================================*/

export function ensureSeeded(): void {
  if (store.seeded) return;
  store.seeded = true;

  const demoUser = userRepo.create({
    name: "Maya Chen",
    email: "demo@flego.com",
    password: bcrypt.hashSync("password123", 10),
    bio: "Full-time backpacker, part-time hammock tester.",
  });

  tripRepo.create({
    title: "Bali Surf & Sunsets",
    destination: "Bali, Indonesia",
    dates: "Oct 12 – Oct 19",
    budget: "$850",
    style: "Backpacking",
    spots: 6,
    description:
      "Chasing waves in Canggu, sunrise hikes up Batur, and cheap warungs the whole way.",
    hostId: demoUser.id,
    host: demoUser.name,
  });

  tripRepo.create({
    title: "Alps Trekking Circuit",
    destination: "Swiss Alps, Switzerland",
    dates: "Sep 5 – Sep 12",
    budget: "$1,400",
    style: "Trekking",
    spots: 5,
    description:
      "Hut-to-hut trekking through the Bernese Oberland. Moderate fitness needed, big views guaranteed.",
    hostId: demoUser.id,
    host: demoUser.name,
  });

  tripRepo.create({
    title: "Sahara Stars Expedition",
    destination: "Merzouga, Morocco",
    dates: "Dec 1 – Dec 6",
    budget: "$650",
    style: "Adventure",
    spots: 4,
    description:
      "Camel trek into the dunes, one night under more stars than you've ever seen.",
    hostId: demoUser.id,
    host: "Omar Haddad",
  });

  tripRepo.create({
    title: "Maldives Luxury Escape",
    destination: "Maldives",
    dates: "Jan 15 – Jan 22",
    budget: "$3,200",
    style: "Luxury",
    spots: 4,
    description:
      "Overwater villas, private sandbank dinners, and a lot of doing absolutely nothing on purpose.",
    hostId: demoUser.id,
    host: "Priya Nair",
  });

  blogRepo.create({
    title: "Getting Lost (On Purpose) in Lisbon's Alfama",
    excerpt:
      "The trick isn't finding the viewpoints everyone photographs — it's the stairwell in between that nobody does.",
    authorId: demoUser.id,
    author: demoUser.name,
    readTime: "6 min read",
    comments: 24,
  });

  blogRepo.create({
    title: "What 30 Days in Patagonia Taught Me About Silence",
    excerpt:
      "No signal, no plans, no small talk. Just wind, glaciers, and the loudest thoughts I've ever had.",
    authorId: demoUser.id,
    author: "Sofia Alvarez",
    readTime: "9 min read",
    comments: 51,
  });

  console.log("🪶 Flego store seeded — demo login: demo@flego.com / password123");
}

ensureSeeded();
