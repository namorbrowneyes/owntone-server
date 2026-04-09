import { createRouter, createWebHashHistory } from 'vue-router'

const TOP_WITH_TABS = 100

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/:all(.*)*', redirect: '/' },
    { component: () => import('@/pages/PageAbout.vue'), name: 'about', path: '/about' },
    { component: () => import('@/pages/PageAlbum.vue'), name: 'music-album', path: '/music/albums/:id' },
    {
      component: () => import('@/pages/PageAlbumSpotify.vue'),
      name: 'music-spotify-album',
      path: '/music/spotify/albums/:id'
    },
    {
      component: () => import('@/pages/PageAlbums.vue'),
      name: 'music-albums',
      path: '/music/albums'
    },
    {
      component: () => import('@/pages/PageArtist.vue'),
      name: 'music-artist',
      path: '/music/artists/:id'
    },
    {
      component: () => import('@/pages/PageArtistSpotify.vue'),
      name: 'music-spotify-artist',
      path: '/music/spotify/artists/:id'
    },
    {
      component: () => import('@/pages/PageArtists.vue'),
      name: 'music-artists',
      path: '/music/artists'
    },
    {
      component: () => import('@/pages/PageArtistTracks.vue'),
      name: 'music-artist-tracks',
      path: '/music/artists/:id/tracks'
    },
    {
      component: () => import('@/pages/PageAudiobookAlbum.vue'),
      name: 'audiobook-album',
      path: '/audiobook/albums/:id'
    },
    {
      component: () => import('@/pages/PageAudiobookAlbums.vue'),
      name: 'audiobook-albums',
      path: '/audiobook/albums'
    },
    {
      component: () => import('@/pages/PageAudiobookArtist.vue'),
      name: 'audiobook-artist',
      path: '/audiobook/artists/:id'
    },
    {
      component: () => import('@/pages/PageAudiobookArtists.vue'),
      name: 'audiobook-artists',
      path: '/audiobook/artists'
    },
    {
      component: () => import('@/pages/PageAudiobookGenres.vue'),
      name: 'audiobook-genres',
      path: '/audiobook/genres'
    },
    {
      name: 'audiobooks',
      path: '/audiobooks',
      redirect: { name: 'audiobook-artists' }
    },
    {
      component: () => import('@/pages/PageOutputs.vue'),
      name: 'outputs',
      path: '/outputs'
    },
    {
      name: 'music',
      path: '/music',
      redirect: { name: 'music-history' }
    },
    {
      component: () => import('@/pages/PageMusic.vue'),
      name: 'music-history',
      path: '/music/history'
    },
    {
      component: () => import('@/pages/PageMusicRecentlyAdded.vue'),
      name: 'music-recently-added',
      path: '/music/recently-added'
    },
    {
      component: () => import('@/pages/PageMusicRecentlyPlayed.vue'),
      name: 'music-recently-played',
      path: '/music/recently-played'
    },
    {
      component: () => import('@/pages/PageMusicSpotify.vue'),
      name: 'music-spotify',
      path: '/music/spotify'
    },
    {
      component: () => import('@/pages/PageMusicSpotifyFeaturedPlaylists.vue'),
      name: 'music-spotify-featured-playlists',
      path: '/music/spotify/featured-playlists'
    },
    {
      component: () => import('@/pages/PageMusicSpotifyFollowedArtists.vue'),
      name: 'music-spotify-followed-artists',
      path: '/music/spotify/followed-artists'
    },
    {
      component: () => import('@/pages/PageMusicSpotifyNewReleases.vue'),
      name: 'music-spotify-new-releases',
      path: '/music/spotify/new-releases'
    },
    {
      component: () => import('@/pages/PageComposerAlbums.vue'),
      name: 'music-composer-albums',
      path: '/music/composers/:name/albums'
    },
    {
      component: () => import('@/pages/PageComposerTracks.vue'),
      name: 'music-composer-tracks',
      path: '/music/composers/:name/tracks'
    },
    {
      component: () => import('@/pages/PageComposers.vue'),
      name: 'music-composers',
      path: '/music/composers'
    },
    { component: () => import('@/pages/PageFiles.vue'), name: 'files', path: '/files' },
    {
      component: () => import('@/pages/PageGenreAlbums.vue'),
      name: 'genre-albums',
      path: '/genres/:name/albums'
    },
    {
      component: () => import('@/pages/PageGenreTracks.vue'),
      name: 'genre-tracks',
      path: '/genres/:name/tracks'
    },
    {
      component: () => import('@/pages/PageGenres.vue'),
      name: 'music-genres',
      path: '/music/genres'
    },
    { component: () => import('@/pages/PagePlayer.vue'), name: 'player', path: '/player' },
    {
      name: 'playlists',
      path: '/playlists',
      redirect: { name: 'playlist-folder', params: { id: 0 } }
    },
    {
      component: () => import('@/pages/PagePlaylistFolder.vue'),
      name: 'playlist-folder',
      path: '/playlists/:id'
    },
    {
      component: () => import('@/pages/PagePlaylistTracks.vue'),
      name: 'playlist',
      path: '/playlists/:id/tracks'
    },
    {
      component: () => import('@/pages/PagePlaylistTracksSpotify.vue'),
      name: 'playlist-spotify',
      path: '/playlists/spotify/:id/tracks'
    },
    { component: () => import('@/pages/PagePodcast.vue'), name: 'podcast', path: '/podcasts/:id' },
    { component: () => import('@/pages/PagePodcasts.vue'), name: 'podcasts', path: '/podcasts' },
    {
      component: () => import('@/pages/PageRadioStreams.vue'),
      name: 'radio',
      path: '/radio'
    },
    {
      component: () => import('@/pages/PageQueue.vue'),
      name: 'queue',
      path: '/'
    },
    {
      component: () => import('@/pages/PageSearchLibrary.vue'),
      name: 'search-library',
      path: '/search/library'
    },
    {
      component: () => import('@/pages/PageSearchSpotify.vue'),
      name: 'search-spotify',
      path: '/search/spotify'
    },
    {
      component: () => import('@/pages/PageSettingsWebinterface.vue'),
      name: 'settings-webinterface',
      path: '/settings/webinterface'
    },
    {
      component: () => import('@/pages/PageSettingsArtwork.vue'),
      name: 'settings-artwork',
      path: '/settings/artwork'
    },
    {
      component: () => import('@/pages/PageSettingsOnlineServices.vue'),
      name: 'settings-online-services',
      path: '/settings/online-services'
    },
    {
      component: () => import('@/pages/PageSettingsDevices.vue'),
      name: 'settings-devices',
      path: '/settings/devices'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    const delay = 0
    if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition)
        }, delay)
      })
    }
    if (to.path === from.path && to.hash) {
      return { behavior: 'smooth', el: to.hash, top: TOP_WITH_TABS }
    }
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, top: TOP_WITH_TABS })
        }, delay)
      })
    }
    return { left: 0, top: 0 }
  }
})
