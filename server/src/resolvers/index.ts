import { Resolver, Query } from "type-graphql";
import { PostResolver } from "./Post";
import { UserResolver } from "./user";

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello() {
    return 'hello world'
  }
}

export default [PostResolver, UserResolver] as [Function, ...Function[]] | [Function, ...Function[]] | readonly [string, ...string[]] | [string, ...string[]]