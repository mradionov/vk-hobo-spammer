<template>
  <form ref="form">
    <div :class="$style.container">
      <div>
        <Group>
          <Label>{{$t('title')}}</Label>
          <Field>
            <input
              type="text"
              :class="$style.input"
              v-model.trim="model.title"
              maxlength="50"
              required
            />
          </Field>
        </Group>

        <Group>
          <Label>{{$t('text')}}</Label>
          <Field>
            <textarea
              :class="$style.input"
              v-model.trim="model.text"
              cols="100"
              rows="30"
              maxlength="4096"
              required
            >
            </textarea>
            <br />
            <span
              :class="{
                [$style.maxText]: isTextCountExceeded
              }
            ">
              {{$t('characterCount')}}:
              <b>{{characterCount}}/{{maxCount}}</b>
            </span>
          </Field>
        </Group>

        <Group :class="$style.photoGroup">
          <Label>{{$t('photos')}}</Label>
          <Field>
            <AttachmentList
              :attachments="model.attachments"
              @addPhoto="handleAttachmentPhotoAdd"
              @removePhoto="handleAttachmentPhotoRemove"
            />
          </Field>
        </Group>

      </div>
      <div
        v-if="isSelectingPhoto"
        :class="$style.right"
      >
        <div :class="$style.photoHeader">
          <span>
            {{$t('selectPhoto')}}
          </span>
          <Button
            :class="$style.photoCancel"
            @click="handlePhotoCancel"
          >
            {{$t('cancel')}}
          </Button>
        </div>
        <PhotoPicker
          :class="$style.photoContent"
          @select="handlePhotoSelect"
        />
      </div>
    </div>
  </form>
</template>

<script>
import AttachmentList from '../presenters/AttachmentList';
import Button from '../presenters/Button';
import PhotoPicker from '../containers/PhotoPicker';
import { Field, Group, Label } from '../presenters/HorizontalForm';

export default {

  components: {
    AttachmentList,
    Button,
    Field,
    Group,
    Label,
    PhotoPicker,
  },

  props: {
    model: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      isSelectingPhoto: false,
    };
  },

  computed: {
    characterCount() {
      return this.model.text.length;
    },
    maxCount() {
      return 4096;
    },
    isTextCountExceeded() {
      return this.characterCount >= this.maxCount;
    },
  },

  methods: {

    handleAttachmentPhotoAdd() {
      this.isSelectingPhoto = true;
    },

    handleAttachmentPhotoRemove(photoAttachment) {
      this.model.attachments = this.model.attachments.filter((attachment) => {
        return attachment.id !== photoAttachment.id;
      });
    },

    handlePhotoCancel() {
      this.isSelectingPhoto = false;
    },

    handlePhotoSelect(photo) {
      this.isSelectingPhoto = false;

      const attachment = {
        id: photo.id,
        ownerId: photo.owner_id,
        thumbSrc: photo.photo_75,
        type: 'photo',
      };

      this.model.attachments.push(attachment);
    },

    requestSubmit() {
      const form = this.$refs.form;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      this.$emit('submit');
    },

  },

  i18n: {
    messages: {
      en: {
        title: 'Title',
        text: 'Text',
        characterCount: 'Character count',
        photos: 'Photos',
        selectPhoto: 'Select photo',
        cancel: 'Cancel',
      },
      ru: {
        title: 'Название',
        text: 'Текст',
        characterCount: 'Количество символов',
        photos: 'Изображения',
        selectPhoto: 'Выбор изображения',
        cancel: 'Отмена',
      },
    },
  },

};
</script>

<style module>
.input {
  border: 1px solid #d3d9de;
  border-radius: 2px;
  color: #000;
  margin: 0;
  padding: 3px 5px;
}

.container {
  display: flex;
}

.right {
  border-left: 1px solid #e7e8ec;
  flex: 1;
  margin-left: 20px;
  padding-left: 20px;
}

.photoGroup {
  margin-top: 20px;
}

.photoHeader {
  align-items: center;
  background: #eee;
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.photoContent {
  border: 1px solid #eee;
  padding: 10px;
  padding-top: 15px;
}

.maxText {
  color: #de0400;
}
</style>
