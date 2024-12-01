-- Ajout de la fonction de gestion des XP quotidiens
CREATE OR REPLACE FUNCTION update_daily_xp(
    user_id_param UUID,
    deck_id_param UUID, 
    xp_to_add INTEGER
) RETURNS INTEGER AS $$
DECLARE
    current_xp INTEGER;
    last_reward_date TIMESTAMP WITH TIME ZONE;
    new_xp INTEGER;
BEGIN
    -- Récupérer les valeurs actuelles
    SELECT daily_xp, last_reward_date 
    INTO current_xp, last_reward_date
    FROM user_progress 
    WHERE user_id = user_id_param AND deck_id = deck_id_param;

    -- Réinitialiser le XP quotidien si c'est un nouveau jour
    IF last_reward_date::date < CURRENT_DATE THEN
        current_xp := 0;
    END IF;

    -- Calculer le nouveau XP en respectant la limite
    new_xp := LEAST(50, COALESCE(current_xp, 0) + xp_to_add);

    RETURN new_xp;
END;
$$ LANGUAGE plpgsql;

-- Mettre à jour la contrainte
ALTER TABLE user_progress 
DROP CONSTRAINT IF EXISTS daily_xp_limit;

ALTER TABLE user_progress 
ADD CONSTRAINT daily_xp_limit 
CHECK (daily_xp >= 0 AND daily_xp <= 50);

-- Ajouter un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_user_progress_last_reward_date 
ON user_progress(last_reward_date);