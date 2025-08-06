<template>
  <div class="user-management">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div>จัดการผู้ใช้งาน</div>
        <v-row align="center" justify="end" no-gutters>  
          <v-col cols="12" md="2" class="mr-4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="ค้นหาผู้ใช้งาน"
              single-line
              hide-details
              density="compact"
              style="width: 100%;"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click="openCreateDialog"
            >
              <v-icon left>mdi-plus</v-icon>
              เพิ่มผู้ใช้
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="users"
          :search="search"
          :loading="loading"
          :items-per-page="10"
          :server-items-length="totalItems"
          v-model:options="options"
          class="elevation-1"
          @update:options="fetchUsers"
        >
          <template #[`item.actions`]="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                icon
                small
                color="warning"
                @click="editUser(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="error"
                @click="deleteUser(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialog สำหรับเพิ่ม/แก้ไขผู้ใช้ -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.username"
                    label="ชื่อผู้ใช้"
                    required
                    :rules="[v => !!v || 'กรุณากรอกชื่อผู้ใช้']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.email"
                    label="อีเมล"
                    required
                    :rules="[
                      v => !!v || 'กรุณากรอกอีเมล',
                      v => /.+@.+\..+/.test(v) || 'กรุณากรอกอีเมลให้ถูกต้อง'
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.password"
                    label="รหัสผ่าน"
                    :required="!editedId"
                    type="password"
                    :rules="passwordRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" v-if="!editedId">
                  <v-text-field
                    v-model="formData.confirmPassword"
                    label="ยืนยันรหัสผ่าน"
                    required
                    type="password"
                    :rules="[
                      v => !!v || 'กรุณายืนยันรหัสผ่าน',
                      v => v === formData.password || 'รหัสผ่านไม่ตรงกัน'
                    ]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            @click="close"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="loading"
            @click="save"
          >
            บันทึก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { userAPI } from '@/services/api'
import Swal from 'sweetalert2'

export default {
  name: 'UserManagementView',
  setup() {
    const loading = ref(false)
    const users = ref([])
    const search = ref('')
    const dialog = ref(false)
    const valid = ref(false)
    const form = ref(null)
    const editedId = ref(null)
    const totalItems = ref(0)
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: []
    })

    const formData = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const headers = ref([
      { 
        title: 'ชื่อผู้ใช้',
        align: 'start',
        key: 'username',
        sortable: true
      },
      { 
        title: 'อีเมล',
        align: 'start',
        key: 'email',
        sortable: true
      },
      { 
        title: 'วันที่สร้าง',
        align: 'start',
        key: 'created_at',
        sortable: true
      },
      { 
        title: 'วันที่แก้ไข',
        align: 'start',
        key: 'updated_at',
        sortable: true
      },
      { 
        title: 'จัดการ',
        align: 'center',
        key: 'actions',
        sortable: false,
        width: '150px'
      }
    ])

    const formTitle = computed(() => {
      return editedId.value ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้'
    })

    const passwordRules = computed(() => {
      if (editedId.value) {
        // กรณีแก้ไข ไม่จำเป็นต้องกรอกรหัสผ่าน
        return []
      } else {
        // กรณีเพิ่มใหม่ ต้องกรอกรหัสผ่าน
        return [
          v => !!v || 'กรุณากรอกรหัสผ่าน',
          v => v.length >= 6 || 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
        ]
      }
    })

    const fetchUsers = async () => {
      try {
        loading.value = true
        const { page, itemsPerPage } = options.value
        const response = await userAPI.getUsers(page, itemsPerPage)
        users.value = response.data
        totalItems.value = response.pagination.totalUsers
      } catch (error) {
        console.error('Error fetching users:', error)
        let errorMessage = 'เกิดข้อผิดพลาด'
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        }
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: errorMessage
        })
      } finally {
        loading.value = false
      }
    }

    const openCreateDialog = () => {
      editedId.value = null
      formData.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
      dialog.value = true
    }

    const editUser = (item) => {
      editedId.value = item.id
      formData.value = {
        username: item.username,
        email: item.email,
        password: '',
        confirmPassword: ''
      }
      dialog.value = true
    }

    const deleteUser = async (item) => {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: `คุณต้องการลบผู้ใช้ "${item.username}" ใช่หรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
      })

      if (result.isConfirmed) {
        try {
          loading.value = true
          await userAPI.deleteUser(item.id)
          await fetchUsers()
          Swal.fire({
            icon: 'success',
            title: 'ลบผู้ใช้สำเร็จ',
            showConfirmButton: false,
            timer: 1500
          })
        } catch (error) {
          console.error('Error deleting user:', error)
          let errorMessage = 'เกิดข้อผิดพลาด'
          if (error.response?.data?.error) {
            errorMessage = error.response.data.error
          }
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: errorMessage
          })
        } finally {
          loading.value = false
        }
      }
    }

    const save = async () => {
      if (!form.value.validate()) return

      try {
        loading.value = true
        const userData = {
          username: formData.value.username,
          email: formData.value.email
        }

        if (formData.value.password) {
          userData.password = formData.value.password
        }

        if (editedId.value) {
          await userAPI.updateUser(editedId.value, userData)
        } else {
          if (!userData.password) {
            throw new Error('กรุณากรอกรหัสผ่าน')
          }
          await userAPI.createUser(userData)
        }

        await fetchUsers()
        dialog.value = false
        Swal.fire({
          icon: 'success',
          title: `${editedId.value ? 'แก้ไข' : 'เพิ่ม'}ผู้ใช้สำเร็จ`,
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        console.error('Error saving user:', error)
        let errorMessage = 'เกิดข้อผิดพลาด'
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error.message) {
          errorMessage = error.message
        }
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: errorMessage
        })
      } finally {
        loading.value = false
      }
    }

    const close = () => {
      dialog.value = false
      form.value?.reset()
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      loading,
      users,
      search,
      dialog,
      valid,
      form,
      editedId,
      formData,
      headers,
      options,
      totalItems,
      formTitle,
      passwordRules,
      openCreateDialog,
      editUser,
      deleteUser,
      save,
      close,
      fetchUsers
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 0px;
}

.gap-2 {
  gap: 8px;
}
</style>
