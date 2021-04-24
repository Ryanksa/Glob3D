# Project Proposal: Glob3D

## URL, Documentation, and Video
- URL to application: https://glob3d.tk
- API Documentation: https://github.com/Ryanksa/Glob3D/blob/master/server/doc.md
- Credits: https://glob3d.tk/credits

## Project Members

- Hung Jen (Ryan) Lin
    - UTORid: linhung3
    - Student Number: 1004185883
    - Email: ryanhungjen.lin@mail.utoronto.ca
- Brian Lin
    - UTORid: linbria3
    - Student Number: 1003976352
    - Email: briankw.lin@mail.utoronto.ca
- Seongjin (Chris) Hong
    - UTORid: hongse10
    - Student Number: 1001694614
    - Email: seongijn.hong@mail.utoronto.ca

## Description of Application

Glob3D is a blogging platform where users walk around a 3D world interacting with blog posts. The 3D world will be made up of tiles/blocks of pre-determined types of land (flat, hills, etc). Initially, we may generate a 10x10-tiled world, and as the number of blog posts increases to fill up the existing space, we will dynamically generate more tiles to expand the world.

On first visit, users can sign in with a third-party account. When signed in, users will be dropped into this 3D world where they can write their own blog post at a chosen spot, read an existing blog post, like and comment on a blog post, open their inventories with a list of posts written and liked. Moreover, users can open a simple map to see their current location, as well as to search keywords to see the locations of other blog posts on the map. Users can follow each other. If user A follows user B, then user A can see the locations of user B's blog posts on their map.

## Key Features of Beta Version

- Sign in with a third-party account (Google)
- Walk around the 3D world with a 3D character model
- Write and post a blog anywhere in the 3D world
- Access and read an existing blog posts
- Like and comment on a blog post

## Additional Features of Final Version

- Follow another user
- Open a map of the world to:
    - see my current location
    - search keywords to find the locations of other blog posts
    - see the locations of posts made by users I follow
- Open a player-unique inventory to:
    - see the list of blog post I made
    - see the list of blog post I liked
    - see the list of users I follow

## Description of Technology

We will be using React on the frontend, nodejs and MongoDB on the backend. To make the 3D models, we will be using threejs and react-three-fiber. 

## Top 5 Challenges

1. Learning to use threejs for our 3D models.
2. Dynamically generating more terrain as blog posts fill up the existing space.
3. Synchronizing concurrent users' actions.
4. Efficiently loading the 3D world and the existing blog posts in it.
5. Map to accurately track locations/directions of the user and posts.
