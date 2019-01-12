<template>
  <div :class="$style.albums">
    <div
      v-if="isFetching"
      :class="$style.info"
    >
      {{$t('loading')}}
    </div>
    <div
      v-if="isFetched && !hasAlbums"
      :class="$style.info"
    >
      {{$t('noItems')}}
    </div>
    <div
      v-for="album in albums"
      :class="$style.album"
      :key="album.id"
      @click="$emit('select', album)"
    >
      <div
        :class="$style.thumb"
        :style="{
          backgroundImage: `url(${album.thumb_src})`,
        }"
      />
      <div :class="$style.caption">
        <div :class="$style.title">
          {{album.title}}
        </div>
        <div :class="$style.count">
          {{album.size}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  inject: ['server'],

  data() {
    return {
      albums: [],
      isFetching: false,
      isFetched: false,
    };
  },

  computed: {
    hasAlbums() {
      return this.albums.length > 0;
    },
  },

  mounted() {
    this.fetchAlbums();
  },

  methods: {

    async fetchAlbums() {
      this.isFetching = true;

      try {
        this.albums = await this.server.send('albums/index');
        this.isFetched = true;
      } catch (err) {
        console.error(err);
        alert(err);
      }

      this.isFetching = false;
    },

  },

  i18n: {
    messages: {
      en: {
        loading: 'Loading...',
        noItems: 'No photos',
      },
      ru: {
        loading: 'Загрузка...',
        noItems: 'Нет альбомов',
      },
    },
  },

};
</script>

<style module>
.albums {
  display: flex;
  flex-wrap: wrap;
  max-height: 320px;
  overflow: auto;
}

.album {
  border: 1px solid #e7e8ec;
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 10px;
}

.album:hover {
  cursor: pointer;
  background: #e7e8ec;
}

.thumb {
  background-repeat: no-repeat;
  background-size: cover;
  height: 130px;
  width: 130px;
}

.caption {
  display: flex;
  margin-top: 5px;
}

.title {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count {
  display: flex;
  flex: 1;
  font-weight: bold;
  justify-content: flex-end;
}

.info {
  color: #818d99;
  flex: 1;
  font-size: 16px;
  padding: 10px;
  text-align: center;
}
</style>
