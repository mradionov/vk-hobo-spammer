<template>
  <div :class="$style.photos">
    <div
      v-if="isFetching"
      :class="$style.info"
    >
      {{$t('loading')}}
    </div>
    <div
      v-if="isFetched && !hasPhotos"
      :class="$style.info"
    >
      {{$t('noItems')}}
    </div>
    <div
      v-for="photo in photos"
      :class="$style.photo"
      :key="photo.id"
      @click="$emit('select', photo)"
    >
      <div
        :class="$style.thumb"
        :style="{
          backgroundImage: `url(${photo.photo_130})`,
        }"
      />
    </div>
  </div>
</template>

<script>
export default {

  inject: ['server'],

  props: {
    albumId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      isFetching: false,
      isFetched: false,
      photos: [],
    };
  },

  computed: {
    hasPhotos() {
      return this.photos.length > 0;
    },
  },

  mounted() {
    this.fetchPhotos();
  },

  methods: {
    async fetchPhotos() {
      this.isFetching = true;

      try {
        this.photos = await this.server.send('photos/index', {
          albumId: this.albumId,
        });
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
        noItems: 'Нет изображений',
      },
    },
  },

};
</script>

<style module>
.photos {
  display: flex;
  flex-wrap: wrap;
  max-height: 320px;
  overflow: auto;
}

.photo {
  border: 1px solid #e7e8ec;
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 10px;
}

.photo:hover {
  cursor: pointer;
  background: #e7e8ec;
}

.thumb {
  background-repeat: no-repeat;
  background-size: cover;
  height: 130px;
  width: 130px;
}

.info {
  color: #818d99;
  flex: 1;
  font-size: 16px;
  padding: 10px;
  text-align: center;
}
</style>
