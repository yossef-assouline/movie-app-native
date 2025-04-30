//track the searches made by the user
import { Client, Databases, Query, ID, Account, Permission, Role } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);
const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);
    
    if(result.documents.length > 0){
      const existingMovie = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
        count: existingMovie.count + 1
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("count"),
      Query.limit(5),
    ]);
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const saveMovie = async (movie: Movie) => {
  try {
    
    // First verify the session is valid
    const session = await account.getSession('current');
    if (!session) throw new Error('No active session');

    const user = await account.get();
    if (!user) throw new Error('User not logged in');

    const existingMovie = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, [
      Query.equal("userId", user.$id),
      Query.equal("movieId", movie.id.toString())
    ]);
    if (existingMovie.documents.length > 0) throw new Error('Movie already saved');

    // Save the movie
    const saved_movie = await database.createDocument(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id,
        movieId: movie.id.toString(),
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        vote_average: movie.vote_average.toString(),
      },
      [
        Permission.read(Role.user(user.$id)), // Only the user can read their saved movies
        Permission.write(Role.user(user.$id)), // Only the user can modify their saved movies
        Permission.delete(Role.user(user.$id)) // Only the user can delete their saved movies
      ]
    );
    console.log("Movie saved successfully", saved_movie);
  } catch (error: any) {
    console.error('Error saving movie:', error);
    throw error;
  }
};
export const getUser = async () => {
  const user = await account.get();
  return user;
};
export const getSavedMovies = async () => {
  try {
    const user = await account.get();
    if (!user) throw new Error('User not logged in');

    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );
    return result.documents;
  } catch (error: any) {
    console.error('Error getting saved movies:', error);
    throw error;
  }
};
export const checkAuth = async () => {
  
  const session = await account.getSession('current');

  if (!session) throw new Error('No active session');
  return session;
};
export const removeSavedMovie = async (movieId: string) => {
  try {
    const user = await account.get();
    if (!user) throw new Error('User not logged in');

    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal("userId", user.$id),
        Query.equal("movieId", movieId)
      ]
    );

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        result.documents[0].$id
      );
    }
  } catch (error: any) {
    console.error('Error removing saved movie:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  await account.createEmailPasswordSession(email, password);
  const loggedInUser = await account.get();
  return loggedInUser;
};

export const register = async (email: string, password: string, name: string) => {
  await account.create(ID.unique(), email, password, name);
  await login(email, password);
  const loggedInUser = await account.get();
  return loggedInUser;
};

export const logout = async () => {
  await account.deleteSession("current");
};