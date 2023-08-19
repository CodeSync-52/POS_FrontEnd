<template>
  <q-card class="min-w-[400px]">
    <q-card-section>
      <div v-if="isFetchingArticleList">
        <q-spinner color="btn-primary" size="3rem" class="mx-auto" />
      </div>
      <div v-else>
        <div class="row items-center q-mb-md justify-between">
          <div class="text-h6">
            <span>Add Article</span>
          </div>
          <q-btn icon="close" flat unelevated dense v-close-popup />
        </div>
        <div v-if="articleList.length">
          <div
            v-for="(article, index) in articleList"
            :key="article.categoryId"
          >
            <q-checkbox
              size="sm"
              color="btn-primary"
              v-model="selectedArticles[index]"
              :label="article.name"
            />
          </div>
        </div>
        <div v-else class="text-center">
          <span>No Article Available</span>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right" v-if="articleList.length">
      <div class="row justify-end gap-4">
        <q-btn
          label="Cancel"
          flat
          unelevated
          color="signature"
          class="bg-btn-cancel hover:bg-btn-cancel-hover"
          v-close-popup
        />
        <q-btn
          flat
          label="Save"
          unelevated
          color="signature"
          class="bg-btn-primary hover:bg-btn-primary-hover"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { IArticleData } from 'src/interfaces';
import { articleListApi } from 'src/services';
import { isPosError } from 'src/utils';
import { onMounted, ref } from 'vue';
const $q = useQuasar();
onMounted(() => {
  getArticleList();
});
const isFetchingArticleList = ref(false);
const selectedArticles = ref<boolean[]>([false]);
const articleList = ref<IArticleData[]>([]);
const getArticleList = async () => {
  if (isFetchingArticleList.value) return;
  isFetchingArticleList.value = true;
  try {
    const res = await articleListApi({ PageNumber: 1, PageSize: 200 });
    if (res.type === 'Success') {
      articleList.value = res.data.items;
    }
  } catch (e) {
    let message = 'Unexpected Error Occurred';
    if (isPosError(e)) {
      message = e.message;
    }
    $q.notify({
      message,
      icon: 'error',
      color: 'red',
    });
  }
  isFetchingArticleList.value = false;
};
</script>
