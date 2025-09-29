import { createUser } from "../api/users";
import { createEvent } from "../api/events";
import { createAnnouncement } from "../api/announcements";
import { createBooth } from "../api/booths";

function toDateOrUndef(v: FormDataEntryValue | null): Date | undefined {
    if (typeof v !== "string" || v.trim() === "") return undefined; // null/空文字は undefined に
    const date = new Date(v); // type="date" or "datetime-local" の文字列を Date に
    return isNaN(date.getTime()) ? undefined : date; // 無効な日付の場合は undefined を返す
  }

export async function createUserAction(tenant: string, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const belong = formData.get('belong') as string;
    const payload = {username, password, role, belong};
    // console.log('payload',payload);
    try {
      const user = await createUser(tenant, payload);
    //   console.log('user',user);
      return user;
    } catch (error) {
      console.error('createUserAction error:', error);
      return {error: 'createUserAction error:' + error};
    }
}

export async function createEventAction(tenant: string, formData: FormData) {
    const event_name = formData.get('event_name') as string;
    const location = formData.get('location') as string;
    const start_at = toDateOrUndef(formData.get('start_at'));
    const end_at = toDateOrUndef(formData.get('end_at'));
    const description = formData.get('description') as string;
    const payload = {event_name, location, start_at, end_at, description};
    // console.log('payload',payload);
    try {
      const event = await createEvent(tenant, payload);
    //   console.log('event',event);
      return event;
    } catch (error) {
      console.error('createEventAction error:', error);
      return {error: 'createEventAction error:' + error};
    }
}

export async function createAnnouncementAction(tenant: string, formData: FormData) {
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const payload = {title, body};
    // console.log('payload',payload);
    try {
      const announcement = await createAnnouncement(tenant, payload);
    //   console.log('announcement',announcement);
      return announcement;
    } catch (error) {
      console.error('createAnnouncementAction error:', error);
      return {error: 'createAnnouncementAction error:' + error};
    }
}

export async function createBoothAction(tenant: string, formData: FormData) {
    const booth_name = formData.get('booth_name') as string;
    const belong = formData.get('belong') as string;
    const location = formData.get('location') as string;
    const summary = formData.get('summary') as string;
    const description_md = formData.get('description_md') as string | undefined;
    const open_from = toDateOrUndef(formData.get('open_from'));
    const open_to = toDateOrUndef(formData.get('open_to'));
    const payload = {booth_name, belong, location, summary, description_md, open_from, open_to};
    // console.log('payload',payload);
    try {
      const booth = await createBooth(tenant, payload);
    //   console.log('booth',booth);
      return booth;
    } catch (error) {
      console.error('createBoothAction error:', error);
      return {error: 'createBoothAction error:' + error};
    }
}