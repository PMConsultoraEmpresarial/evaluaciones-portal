// ========== SUPABASE CONFIG ==========

const SUPABASE_URL = 'https://prxsoggagrcbhaugyxnx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByeHNvZ2dhZ3JjYmhhdWd5eG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NzMzMDksImV4cCI6MjEwMTU0OTMwOX0.S0M0-N_Q_KjGuW-Gbk2_01mXgv3-3dxgTwyVf25ltBM';

console.log('config.js cargado');
console.log('URL:', SUPABASE_URL);

// ========== GET EVALUATIONS ==========
async function getEvaluations() {
  console.log('Fetching evaluations...');
  try {
    const url = `${SUPABASE_URL}/rest/v1/evaluations?order=created_at.desc`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Evaluations loaded:', data.length);
    return data;
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }
}

// ========== GET PRACTITIONERS ==========
async function getPractitioners() {
  console.log('Fetching practitioners...');
  try {
    const url = `${SUPABASE_URL}/rest/v1/practitioners?order=first_name.asc`;
    
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Practitioners loaded:', data.length);
    return data;
  } catch (error) {
    console.error('Error fetching practitioners:', error);
    throw error;
  }
}

// ========== GET INDICATORS ==========
async function getIndicators(evaluationId) {
  console.log('Fetching indicators for:', evaluationId);
  try {
    const url = `${SUPABASE_URL}/rest/v1/evaluation_indicators?evaluation_id=eq.${evaluationId}&order=order_number.asc`;
    
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching indicators:', error);
    return [];
  }
}

// ========== ASSIGN EVALUATION ==========
async function assignEvaluation(evaluationId, practitionerIds) {
  console.log('Assigning evaluation:', evaluationId, 'to', practitionerIds.length, 'practitioners');
  
  try {
    const assignments = practitionerIds.map(pid => ({
      evaluation_id: evaluationId,
      practitioner_id: pid,
      status: 'assigned'
    }));
    
    console.log('Assignments:', assignments);
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/evaluation_assignments`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(assignments)
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('Assignment successful');
    return true;
  } catch (error) {
    console.error('Error assigning evaluation:', error);
    throw error;
  }
}

// ========== SAVE SCORE ==========
async function saveScore(assignmentId, scores, observations) {
  console.log('Saving score for assignment:', assignmentId);
  
  try {
    const scoreValues = Object.values(scores).map(s => parseInt(s));
    const average = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/evaluation_scores`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          assignment_id: assignmentId,
          scores: scores,
          average_score: average,
          overall_observations: observations
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('Score saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}

console.log('Todas las funciones definidas');
