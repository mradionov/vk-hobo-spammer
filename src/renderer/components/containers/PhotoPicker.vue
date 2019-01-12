<template>
  <div>
    <div :class="$style.nav">
      <span
        :class="[
          $style.album,
          isAlbumSelected && $style.selected,
        ]"
        @click="handleBackClick"
      >
        {{$t('albums')}}
      </span>
      <span
        v-if="isAlbumSelected"
        :class="$style.separator"
      >
        &gt;
      </span>
      <span
        v-if="isAlbumSelected"
        :class="$style.title"
      >
        {{album.title}}
      </span>
    </div>
    <div v-show="!isAlbumSelected">
      <AlbumList
        @select="handleAlbumSelect"
      />
    </div>
    <div v-if="isAlbumSelected">
      <PhotoList
        :albumId="album.id"
        @select="handlePhotoSelect"
      />
    </div>
  </div>
</template>

<script>
import AlbumList from './AlbumList';
import PhotoList from './PhotoList';

export default {

  components: {
    AlbumList,
    PhotoList,
  },

  data() {
    return {
      album: null,
    };
  },

  computed: {
    isAlbumSelected() {
      return this.album !== null;
    },
  },

  methods: {

    handleBackClick() {
      this.album = null;
    },

    handleAlbumSelect(album) {
      this.album = album;
    },

    handlePhotoSelect(photo) {
      this.$emit('select', photo);
    },

  },

  i18n: {
    messages: {
      en: {
        albums: 'Albums',
      },
      ru: {
        albums: 'Альбомы',
      },
    },
  },

};
</script>

<style module>
.nav {
  margin-bottom: 10px;
}

.separator {
  margin: 0 5px;
}

.album {
  font-weight: bold;
}

.album.selected {
  color: #656565;
  cursor: pointer;
  text-decoration: underline;
}

.album.selected:hover {
  color: #8e8d8d;
}

.title {
  font-weight: bold;
}
</style>
