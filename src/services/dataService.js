import { supabase } from '../lib/supabase';
import { courseTracks } from '../data/courses';
import { teamMembers, ceo } from '../data/team';
import { featuredProjects, projectPhases } from '../data/projects';

/**
 * Data Service to centralize all data fetching.
 * Currently uses local data, but structured for easy Supabase integration.
 */
export const dataService = {
  // Courses
  async getCourses() {
    // To switch to Supabase:
    // const { data, error } = await supabase.from('courses').select('*');
    // if (error) throw error;
    // return data;
    return courseTracks;
  },

  // Team
  async getTeam() {
    return teamMembers;
  },

  async getCEO() {
    return ceo;
  },

  // Projects
  async getProjects() {
    return featuredProjects;
  },

  async getProjectPhases() {
    return projectPhases;
  }
};
