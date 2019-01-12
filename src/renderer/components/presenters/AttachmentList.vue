<template>
  <div>
    <div :class="$style.header">
      <Button @click="$emit('addPhoto')">
        {{$t('addPhoto')}}
      </Button>
    </div>
    <div
      v-if="hasPhotos"
      :class="$style.photos"
    >
      <div
        v-for="photo in photos"
        :class="$style.photo"
        :key="photo.id"
      >
        <div
          :class="$style.thumb"
          :style="{
            backgroundImage: `url(${photo.thumbSrc})`,
          }"
        />
        <div
          :class="$style.remove"
          :title="$t('remove')"
          @click="$emit('removePhoto', photo)"
        >
          &times;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button';

import { ATTACHMENT_TYPES } from '~/constants/attachment';

export default {

  components: {
    Button,
  },

  props: {
    attachments: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    hasAttachments() {
      return this.attachments.length > 0;
    },
    photos() {
      return this.attachments.filter((attachment) => {
        return attachment.type === ATTACHMENT_TYPES.photo;
      });
    },
    hasPhotos() {
      return this.photos.length > 0;
    },
  },

  i18n: {
    messages: {
      en: {
        addPhoto: '+ Add photo',
        remove: 'Remove',
      },
      ru: {
        addPhoto: '+ Добавить изображение',
        remove: 'Удалить',
      },
    },
  },

};
</script>

<style module>
.photos {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.photo {
  margin-bottom: 5px;
  margin-right: 5px;
  position: relative;
}

.thumb {
  background-repeat: no-repeat;
  background-size: cover;
  height: 75px;
  width: 75px;
}

.remove {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(29,32,34,.6);
  cursor: pointer;
  width: 20px;
  height: 20px;
  cursor: pointer;
  outline: none;
  font-size: 18px;
  color: #fff;
  text-align: center;
}
</style>
