import { Injectable } from '@asuka/di'
import { ajax } from 'rxjs/ajax'

@Injectable()
export class RepoService {
  getRepoByUsers(username: string) {
    return ajax.getJSON(`https://api.github.com/users/${username}/repos`)
  }
}
